import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * A form component to create or edit a lead.
 * On mobile the form is rendered inside a full-screen sheet so all inputs
 * must be comfortably tappable (min-h-[44px], larger font on mobile).
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Shared class helpers
  const labelClass = 'block text-sm font-medium text-gray-300 dark:text-slate-700 mb-1';
  const inputBase =
    'w-full px-3 py-3 md:py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-800 dark:bg-white text-white dark:text-gray-900 transition-colors min-h-[44px]';
  const inputNormal = `${inputBase} border-gray-600 dark:border-slate-300`;
  const inputError = `${inputBase} border-red-500`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? inputError : inputNormal}
          placeholder="e.g. Jane Doe"
          autoComplete="name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelClass}>
          Company <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={errors.company ? inputError : inputNormal}
          placeholder="e.g. Acme Corp"
          autoComplete="organization"
        />
        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? inputError : inputNormal}
          placeholder="jane@example.com"
          autoComplete="email"
          inputMode="email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputNormal}
          placeholder="(555) 123-4567"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      {/* Status + Source — side by side on sm+, stacked on xs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`${inputNormal} cursor-pointer`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className={labelClass}>
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`${inputNormal} cursor-pointer`}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-700 dark:border-slate-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-3 md:py-2 text-sm font-medium text-gray-300 dark:text-slate-700 bg-gray-700 dark:bg-white border border-gray-600 dark:border-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-3 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
        >
          {initialData ? 'Save Changes' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
