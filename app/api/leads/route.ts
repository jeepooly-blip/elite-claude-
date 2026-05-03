import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      event_id,
      full_name,
      email,
      whatsapp,
      group_size,
      budget_range,
      preferred_team,
      needs_hotel,
      needs_flights,
      corporate_gift,
      message,
    } = body;

    // Validate required fields
    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          event_id: event_id || null,
          full_name,
          email,
          whatsapp: whatsapp || null,
          group_size: group_size || null,
          budget_range: budget_range || null,
          preferred_team: preferred_team || null,
          needs_hotel: needs_hotel || false,
          needs_flights: needs_flights || false,
          corporate_gift: corporate_gift || false,
          message: message || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // TODO: Send notification to Dubai team
    // - WhatsApp notification via Twilio
    // - Email notification via Resend/SendGrid
    // - Slack webhook for high-value leads

    return NextResponse.json(
      {
        success: true,
        lead_id: data.id,
        message: 'Lead created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
