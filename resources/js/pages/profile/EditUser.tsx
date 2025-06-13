import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    description?: string;
    image?: string;
  };
}

export default function EditUser({ user }: Props) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    description: user.description || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState(user.image ? `${window.location.origin}/${user.image}` : '');
  const [file, setFile] = useState<File | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    else if (formData.name.length < 2) newErrors.name = 'Debe tener al menos 2 caracteres.';

    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Formato de correo inválido.';

    if (formData.description.length > 500) newErrors.description = 'Máximo 500 caracteres.';

    if (file) {
      if (!file.type.startsWith('image/')) newErrors.image = 'El archivo debe ser una imagen.';
      if (file.size > 5 * 1024 * 1024) newErrors.image = 'La imagen debe pesar menos de 5MB.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear individual error
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('description', formData.description);
    if (file) data.append('image', file);
    data.append('_method', 'PUT');

    router.post(`/profile/update`, data, { preserveScroll: true });
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-[#101828]">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">✏️ Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full mt-1 rounded-lg border p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-1 rounded-lg border p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full mt-1 rounded-lg border p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Foto de perfil</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="h-24 w-24 rounded-full object-cover shadow mb-3"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`block w-full rounded-lg border p-2 dark:bg-[#1E293B] dark:text-white ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}

          {user.image && !file && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Imagen actual: <code>{user.image}</code>
            </p>
          )}
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </form>
    </section>
  );
}
