import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        content: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            index: true,
            validate: {
                validator: function (v) {
                    return v.length <= 10;
                },
                message: 'A note cannot have more than 10 tags',
            },
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: String, // Assuming string ID for now (e.g. from Auth provider)
            required: [true, 'User ID is required'],
            index: true,
        },
        color: {
            type: String,
            default: 'default',
        },
    },
    {
        timestamps: true,
    }
);

// Custom validation: Either title or content must be provided
NoteSchema.pre('validate', function (next) {
    if (!this.title && !this.content) {
        this.invalidate('title', 'Either title or content must be provided');
        this.invalidate('content', 'Either title or content must be provided');
    }
    next();
});

// Indexes
// Improve search performance
NoteSchema.index({ title: 'text', content: 'text' });
// Improve sorting/filtering by user
NoteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
