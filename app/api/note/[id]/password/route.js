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

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        if (password.length > 8) {
            return NextResponse.json(
                { success: false, error: 'Password must be at most 8 characters' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const note = await Note.findOneAndUpdate(
            { customUrl: id, userId },
            { passwordHash: hash },
            { new: true }
        );

        if (!note) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: { protected: !!note.passwordHash } });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        const note = await Note.findOneAndUpdate(
            { customUrl: id, userId },
            { $unset: { passwordHash: 1 } },
            { new: true }
        );

        if (!note) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: { protected: !!note.passwordHash } });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
