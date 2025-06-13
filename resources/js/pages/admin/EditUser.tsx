import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    rol: 'user' | 'profesor';
    description?: string;
    isBanned: boolean;
    image?: string;
  };
}

export default function EditUser({ user }: Props) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    rol: user.rol,
    description: user.description || '',
    isBanned: user.isBanned,
  });

  // Construye URL completa para la imagen si existe
  const initialImageUrl = user.image ? `${window.location.origin}/${user.image}` : '';

  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('rol', formData.rol);
    data.append('description', formData.description);
    data.append('isBanned', formData.isBanned ? '1' : '0');

    if (file) {
      data.append('image', file);
    }

    data.append('_method', 'PUT');

    router.post(`/admin/${user.id}/updateUser`, data, {
      preserveScroll: true,
    });
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-[#101828]">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">✏️ Editar Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white"
            required
          />
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full mt-1 rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white"
            disabled
          >
            <option value="user">Estudiante</option>
            <option value="profesor">Profesor</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full mt-1 rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 dark:bg-[#1E293B] dark:text-white"
          />
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
            className="block w-full rounded-lg border border-gray-300 bg-white p-2 dark:bg-[#1E293B] dark:text-white"
          />

          {user.image && !file && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Imagen actual: <code>{user.image}</code>
            </p>
          )}
        </div>

        {/* ¿Baneado? */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isBanned"
            checked={formData.isBanned}
            onChange={handleChange}
            className="h-5 w-5 accent-red-600"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">¿Está baneado?</label>
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
