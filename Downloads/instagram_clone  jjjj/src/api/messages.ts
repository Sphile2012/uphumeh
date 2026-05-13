import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Message = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

export interface MessageWithProfile extends Message {
  sender_profile: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
  receiver_profile: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
}

export interface Conversation {
  user: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
  last_message: Message
  unread_count: number
}

// Send message
export const sendMessage = async (messageData: MessageInsert): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get conversation messages
export const getConversationMessages = async (
  userId1: string,
  userId2: string,
  page = 0,
  limit = 50
): Promise<MessageWithProfile[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender_profile:sender_id (
        id,
        username,
        full_name,
        avatar_url
      ),
      receiver_profile:receiver_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) throw error
  return data as MessageWithProfile[]
}

// Get user conversations
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase.rpc('get_user_conversations', {
    user_id: userId
  })

  if (error) throw error
  return data
}

// Mark messages as read
export const markMessagesAsRead = async (senderId: string, receiverId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .eq('is_read', false)

  if (error) throw error
}

// Get unread message count
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count || 0
}

// Delete message
export const deleteMessage = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)

  if (error) throw error
}

// Subscribe to new messages
export const subscribeToMessages = (
  userId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}