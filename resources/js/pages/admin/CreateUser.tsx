import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  rol: string;
}

export default function CreateUser({ rol }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rol: rol,
    description: '',
    isBanned: false,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido.';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Imagen (opcional) pero si existe, validar tipo y tamaño
    if (file) {
      if (!file.type.startsWith('image/')) {
        newErrors.image = 'El archivo debe ser una imagen válida.';
      } else if (file.size > 5 * 1024 * 1024) {
        newErrors.image = 'La imagen debe pesar menos de 5MB.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('rol', formData.rol);
    data.append('description', formData.description);
    data.append('isBanned', formData.isBanned ? '1' : '0');

    if (file) {
      data.append('image', file);
    }

    router.post('/admin/storeUser', data, {
      preserveScroll: true,
    });
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-[#101828]">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        ➕ Crear {rol === 'student' ? 'Estudiante' : 'Profesor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full mt-1 rounded-lg border p-3 dark:bg-[#1E293B] dark:text-white ${
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
            className={`w-full mt-1 rounded-lg border p-3 dark:bg-[#1E293B] dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full mt-1 rounded-lg border p-3 dark:bg-[#1E293B] dark:text-white ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full mt-1 rounded-lg border p-3 dark:bg-[#1E293B] dark:text-white"
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
            className={`block w-full rounded-lg border p-2 dark:bg-[#1E293B] dark:text-white ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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
            Crear {rol === 'student' ? 'Estudiante' : 'Profesor'}
          </button>
        </div>
      </form>
    </section>
  );
}
