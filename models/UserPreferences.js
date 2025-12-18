import mongoose from 'mongoose';

const UserPreferencesSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
            index: true,
        },
        theme: {
            type: String,
            default: 'system', // 'light', 'dark', 'system'
        },
        fontSize: {
            type: String,
            default: 'medium', // 'small', 'medium', 'large'
        },
        // Allow strictly typed fields but also flexible expansion if needed
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.UserPreferences || mongoose.model('UserPreferences', UserPreferencesSchema);
