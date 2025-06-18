'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-8">
        {/* Placeholder for Profile Information */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <p>Placeholder for form to edit name and other profile details.</p>
        </section>

        {/* Placeholder for Password Change */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Password Change</h2>
          <p>Placeholder for form to change password.</p>
        </section>

        {/* Placeholder for Email Change */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Email Change</h2>
          <p>Placeholder for form to change email address.</p>
        </section>

        {/* Placeholder for Account Deletion */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Account Deletion</h2>
          <p>Placeholder for option to delete account.</p>
        </section>
      </div>
    </div>
  );
}