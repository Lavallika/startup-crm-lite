import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Mongoose Schema representing a User in the CRM system.
 * Includes user profile, role, status, and authentication credentials.
 */
export const userSchema = new mongoose.Schema(
  {
    /**
     * The full name of the user.
     * Required. Must be between 2 and 50 characters, trimmed of whitespace.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * The unique email address of the user.
     * Required. Lowercased, trimmed, and validated against a proper email format regex.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address']
    },
    /**
     * The hashed password of the user.
     * Required. Must be at least 6 characters long. Will be hashed using bcrypt before saving.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long']
    },
    /**
     * The authorization role of the user within the CRM system.
     * Must be either 'admin' or 'user'. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role'
      },
      default: 'user'
    },
    /**
     * Flag indicating whether the user account is active.
     * Defaults to true.
     */
    isActive: {
      type: Boolean,
      default: true
    },
    /**
     * User notification preferences for alerts and digests.
     */
    notificationPreferences: {
      emailAlerts: {
        type: Boolean,
        default: true
      },
      weeklyDigest: {
        type: Boolean,
        default: true
      },
      stageChanges: {
        type: Boolean,
        default: true
      },
      taskReminders: {
        type: Boolean,
        default: true
      },
      accountAlerts: {
        type: Boolean,
        default: true
      },
      marketingUpdates: {
        type: Boolean,
        default: false
      }
    },
    /**
     * User CRM workflow preferences.
     */
    crmPreferences: {
      defaultLeadStatus: {
        type: String,
        default: 'New'
      },
      dateFormat: {
        type: String,
        default: 'MM/DD/YYYY'
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash the password before saving the user document.
 * Checks if the password field is modified; if so, hashes it using bcryptjs with 10 salt rounds.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a plain text candidate password with the user's hashed password.
 *
 * @param {string} candidatePassword - The plain text password to compare.
 * @returns {Promise<boolean>} Resolves to true if password matches, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * Overrides the toJSON method to remove the password field from the JSON output.
 *
 * @returns {Object} The plain user object without the password property.
 */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// Create the User model
export const User = mongoose.model('User', userSchema);

// Export User model as default export
export default User;
