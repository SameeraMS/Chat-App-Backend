// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule], // Import SupabaseModule to access SupabaseService
  providers: [ChatGateway],
})
export class ChatModule {}
