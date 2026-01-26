-- RUN THIS IN SUPABASE SQL EDITOR TO DEBUG

-- 1. Check if you are actually a participant in the chat
select * from chats 
where id = 'PUT_YOUR_CHAT_ID_HERE';

-- 2. Check if you can insert a message manually (simulating the query)
-- Replace 'PUT_YOUR_CHAT_ID_HERE' with the chat ID
-- Replace 'PUT_YOUR_USER_ID_HERE' with your user ID (from auth.uid())
begin;
insert into messages (chat_id, sender_id, content)
values ('PUT_YOUR_CHAT_ID_HERE', 'PUT_YOUR_USER_ID_HERE', 'Debug test message')
returning *;
rollback; -- This rolls back the change so it doesn't stay in DB
