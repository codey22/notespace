import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Note from '../models/Note.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testSchema() {
    console.log('Testing Note Schema (Validation Only)...');
    console.log('Note model type:', typeof Note);
    if (typeof Note !== 'function') {
        console.error('Note is not a constructor/function. Value:', Note);
    }

    // We don't strictly need a DB connection to test Mongoose validations
    // validations are run pre-save or explicitly via .validate()

    try {
        // Test 1: Valid Note
        console.log('\nTest 1: Creating a valid note...');
        try {
            const validNote = new Note({
                title: 'Test Note',
                content: 'This is a test note',
                userId: 'test-user-123',
                tags: ['test', 'schema']
            });
            await validNote.validate();
            console.log('✅ Valid note validation passed');
        } catch (err) {
            console.error('❌ Valid note validation failed:', err.message);
        }

        // Test 2: Invalid Note (Missing userId)
        console.log('\nTest 2: Validation check - Missing userId...');
        try {
            const invalidNote = new Note({
                title: 'No User',
                content: 'Content'
            });
            await invalidNote.validate();
            console.error('❌ Missing userId validation failed (Should have thrown error)');
        } catch (err) {
            if (err.errors && err.errors.userId) {
                console.log('✅ Detected missing userId as expected');
            } else {
                console.error('❌ Unexpected error:', err.message);
            }
        }

        // Test 3: Invalid Note (No title AND No content)
        console.log('\nTest 3: Validation check - No title & No content...');
        try {
            const emptyNote = new Note({
                userId: 'test-user-123'
            });
            await emptyNote.validate();
            console.error('❌ Empty content validation failed (Should have thrown error)');
        } catch (err) {
            if (err.message.includes('Either title or content')) {
                console.log('✅ Detected empty note as expected');
            } else {
                console.error('❌ Unexpected error:', err.message);
            }
        }

        // Test 4: Invalid Note (Too long title)
        console.log('\nTest 4: Validation check - Title too long...');
        try {
            const longTitleNote = new Note({
                title: 'a'.repeat(101),
                content: 'content',
                userId: 'test-user-123'
            });
            await longTitleNote.validate();
            console.error('❌ Long title validation failed (Should have thrown error)');
        } catch (err) {
            if (err.errors && err.errors.title) {
                console.log('✅ Detected long title as expected');
            } else {
                console.error('❌ Unexpected error:', err.message);
            }
        }

        console.log('\nDone testing schema validations.');
        process.exit(0);

    } catch (error) {
        console.error('Test script error:', error);
        process.exit(1);
    }
}

testSchema();
