
-- Enable pgcrypto for password hashing
create extension if not exists "pgcrypto";

-- 1. CLEANUP (Force schema update)
drop table if exists admin_logs cascade;
drop table if exists admins cascade;

-- 2. CREATE SECURE TABLES

-- Admins Table
create table admins (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    password_hash text not null,
    role text default 'super_admin' check (role in ('super_admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_login timestamp with time zone
);

-- Admin Logs Table (for rate limiting and audit)
create table admin_logs (
    id uuid default gen_random_uuid() primary key,
    ip_address text,
    attempted_email text,
    success boolean not null,
    details text, -- reason for failure
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ENABLE RLS (Strict Security)
alter table admins enable row level security;
alter table admin_logs enable row level security;

-- Deny all public access (Only Service Role/Edge Function can access)
create policy "Deny all public access to admins" on admins for all using (false);
create policy "Deny all public access to admin_logs" on admin_logs for all using (false);

-- 4. INSERT ADMIN USER
-- Password: Vaibhav07
insert into admins (email, password_hash)
values (
    'vi1804365@gmail.com',
    extensions.crypt('Vaibhav07', extensions.gen_salt('bf'))
);

-- 5. RPC FUNCTION (For Safe Verification)
create or replace function verify_admin_credentials(email_input text, password_input text)
returns json
language plpgsql
security definer
as $$
declare
    admin_record record;
begin
    -- 1. Find admin
    select * into admin_record from admins where email = email_input;
    
    if not found then
        return json_build_object('success', false, 'message', 'Invalid credentials');
    end if;

    -- 2. Verify Password (Hash comparison)
    if admin_record.password_hash = extensions.crypt(password_input, admin_record.password_hash) then
        -- Update last login
        update admins set last_login = now() where id = admin_record.id;
        return json_build_object('success', true, 'id', admin_record.id, 'role', admin_record.role);
    else
        return json_build_object('success', false, 'message', 'Invalid credentials');
    end if;
end;
$$;
