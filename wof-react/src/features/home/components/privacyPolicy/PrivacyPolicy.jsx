import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className='w-full py-16 text-white px-4'>
            <div className='max-w-[1240px] mx-auto'>
                <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>
                    Privacy Policy
                </h1>
                <p>
                    Welcome to RoadworthySL’s Warrant of Fitness (WoF) application. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our WoF application. By using our application, you consent to the data practices described in this policy.
                </p>
                <h2 className='text-xl font-bold py-2'>Information We Collect</h2>
                <ul>
                    <li>Account Information: Includes your name, email address, contact information, and password used to create an account in the WoF application.</li>
                    <li>Vehicle Information: Includes details about the vehicles you add to your account, such as make, model, registration number, and vehicle identification number (VIN).</li>
                    <li>Inspection Records: We collect records of all vehicle inspections conducted through the app, including the date, findings, and any recommendations.</li>
                    <li>Examiner Information: If you are an examiner, we collect your professional credentials, contact details, and service history.</li>
                </ul>

                <h2 className='text-xl font-bold py-2'>How We Use Your Information</h2>
                <p>
                    We use your information to provide services, manage your account, communicate with you, improve our application, and comply with legal requirements.
                </p>

                <h2 className='text-xl font-bold py-2'>How We Share Your Information</h2>
                <p>
                    We may share your information with service providers who assist us in offering services (such as data analysis and email delivery), and as required by law.
                </p>

                <h2 className='text-xl font-bold py-2'>Your Rights and Choices</h2>
                <p>
                    You have rights to access, update, or delete your account information through your account settings. You can also contact us to inquire about these rights.
                </p>

                <h2 className='text-xl font-bold py-2'>Data Security</h2>
                <p>
                    We implement security measures to protect your data. However, no electronic transmission over the internet can be guaranteed to be completely secure.
                </p>

                <h2 className='text-xl font-bold py-2'>Changes to This Privacy Policy</h2>
                <p>
                    We may update this privacy policy periodically. The revised policy will be effective immediately upon posting.
                </p>

                <h2 className='text-xl font-bold py-2'>Contact Us</h2>
                <p>
                    If you have questions about this policy, you may contact us via email at [Insert Contact Email] or by post to [Insert Address].
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
