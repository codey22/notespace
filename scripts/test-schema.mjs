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
            console.log('PASSED: Valid note validation passed');
        } catch (err) {
            console.error('FAILED: Valid note validation failed:', err.message);
        }

        // Test 2: Invalid Note (Missing userId)
        console.log('\nTest 2: Validation check - Missing userId...');
        try {
            const invalidNote = new Note({
                title: 'No User',
                content: 'Content'
            });
            await invalidNote.validate();
            console.error('FAILED: Missing userId validation failed (Should have thrown error)');
        } catch (err) {
            if (err.errors && err.errors.userId) {
                console.log('PASSED: Detected missing userId as expected');
            } else {
                console.error('FAILED: Unexpected error:', err.stack);
            }
        }

        // Test 3: Invalid Note (No title AND No content)
        console.log('\nTest 3: Validation check - No title & No content...');
        try {
            const emptyNote = new Note({
                userId: 'test-user-123'
            });
            await emptyNote.validate();
            console.error('FAILED: Empty content validation failed (Should have thrown error)');
        } catch (err) {
            if (err.message.includes('Either title or content')) {
                console.log('PASSED: Detected empty note as expected');
            } else {
                console.error('FAILED: Unexpected error:', err.stack);
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
            console.error('FAILED: Long title validation failed (Should have thrown error)');
        } catch (err) {
            if (err.errors && err.errors.title) {
                console.log('PASSED: Detected long title as expected');
            } else {
                console.error('FAILED: Unexpected error:', err.stack);
            }
        }

        // Test 5: Invalid Note (Too long content)
        console.log('\nTest 5: Validation check - Content too long...');
        try {
            const longContentNote = new Note({
                title: 'Valid Title',
                content: 'a'.repeat(20001),
                userId: 'test-user-123'
            });
            await longContentNote.validate();
            console.error('FAILED: Long content validation failed (Should have thrown error)');
        } catch (err) {
            if (err.errors && err.errors.content) {
                console.log('PASSED: Detected long content as expected');
            } else {
                console.error('FAILED: Unexpected error:', err.stack);
            }
        }

        // Test 6: Invalid Note (Tag too long)
        console.log('\nTest 6: Validation check - Tag too long...');
        try {
            const longTagNote = new Note({
                title: 'Valid Title',
                content: 'Content',
                userId: 'test-user-123',
                tags: ['a'.repeat(51)]
            });
            await longTagNote.validate();
            console.error('FAILED: Long tag validation failed (Should have thrown error)');
        } catch (err) {
            // Accessing the specific error for the tags field
            if (err.errors && err.errors.tags) {
                console.log('PASSED: Detected long tag as expected');
            } else {
                console.error('FAILED: Unexpected error:', err.stack);
            }
        }

        console.log('\nSchema Tests Completed.');

    } catch (error) {
        console.error('Critical Error:', error);
    }
}

testSchema();
