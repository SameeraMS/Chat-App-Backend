// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getData(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async insertData(tableName: string, data: any) {
    try {
      const { data: insertedData, error } = await this.supabase
        .from(tableName)
        .insert([data]);
      if (error) {
        throw new Error(`Error inserting data: ${error.message}`);
      }
      console.log('Data inserted successfully:', insertedData);
      return insertedData;
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error; // Rethrow error after logging it
    }
  }
}

export default SupabaseService;
