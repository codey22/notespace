import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { password } = await req.json();
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        const note = await Note.findOne({ customUrl: id, userId }).select('+passwordHash');

        if (!note) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        if (!note.passwordHash) {
            return NextResponse.json(
                { success: false, error: 'No password set' },
                { status: 400 }
            );
        }

        const match = await bcrypt.compare(password || '', note.passwordHash);

        if (!match) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
