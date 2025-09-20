import OrganizerSchema from "../../modules/OrganiSchema.js";

export const OrganizerSignupService = async ({ Name, surname, email, password, phoneNumber, gender, dateOfBirth }) => {
    try {
        // Check if organizer already exists
        const existingOrganizer = await OrganizerSchema.findOne({ email });
        if (existingOrganizer) {
            throw new Error('An account with this email already exists');
        }

        // Create new organizer
        const organizer = new OrganizerSchema({
            Name,
            surname,
            email,
            password,
            phoneNumber,
            gender,
            dateOfBirth: new Date(dateOfBirth)
        });

        // Save organizer to database
        await organizer.save();

        // Return organizer data (password is automatically removed by the schema's toJSON method)
        return {
            success: true,
            message: 'Registration successful',
            organizer
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const OrganizerLoginService = async ({ email, password }) => {
    try {
        // Find organizer by email
        const organizer = await OrganizerSchema.findOne({ email });
        if (!organizer) {
            throw new Error('Invalid email or password');
        }

        // Check password
        const isMatch = await organizer.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // Return organizer data (password is automatically removed by the schema's toJSON method)
        return {
            success: true,
            message: 'Login successful',
            organizer: {
                _id: organizer._id,
                Name: organizer.Name,
                surname: organizer.surname,
                email: organizer.email,
                phoneNumber: organizer.phoneNumber,
                type: organizer.type,
                createdAt: organizer.createdAt
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const OrganizerProfileService = async (organizerId) => {
    try {
        const organizer = await OrganizerSchema.findById(organizerId).select('-password');
        if (!organizer) {
            throw new Error('Organizer not found');
        }
        return { success: true, data: organizer };
    } catch (error) {
        console.error('Organizer Profile Error:', error);
        throw new Error("Failed to fetch organizer profile: " + error.message);
    }
};

