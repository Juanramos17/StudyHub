import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  teachers: Teacher[];
}

export default function CreateCourse({ teachers }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher_id: teachers[0]?.id || '',
    isHidden: false,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [filePdf, setFilePdf] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      setFileImage(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFilePdf(selected);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del curso es obligatorio.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Debe seleccionar un profesor.';
    }

    // Validar PDF (obligatorio)
    if (!filePdf) {
      newErrors.pdf = 'El archivo PDF es obligatorio.';
    } else {
      if (filePdf.type !== 'application/pdf') {
        newErrors.pdf = 'El archivo debe ser un PDF.';
      } else if (filePdf.size > 10 * 1024 * 1024) {
        newErrors.pdf = 'El PDF debe pesar menos de 10MB.';
      }
    }

    // Validar imagen solo si hay archivo seleccionado
    if (fileImage) {
      if (!fileImage.type.startsWith('image/')) {
        newErrors.image = 'El archivo debe ser una imagen válida.';
      } else if (fileImage.size > 5 * 1024 * 1024) {
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
    data.append('description', formData.description);
    data.append('teacher_id', formData.teacher_id);
    data.append('isHidden', formData.isHidden ? '1' : '0');

    if (fileImage) data.append('image', fileImage);
    if (filePdf) data.append('pdf', filePdf);

    router.post('/admin/storeCourse', data, {
      preserveScroll: true,
    });
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-[#101828]">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">📘 Crear Nuevo Curso</h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Nombre del curso
          </label>
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

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full mt-1 rounded-lg border p-3 dark:bg-[#1E293B] dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>


        {/* Profesor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Profesor</label>
          <select
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            className={`w-full mt-1 rounded-lg border bg-white p-3 dark:bg-[#1E293B] dark:text-white ${
              errors.teacher_id ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacher_id && <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>}
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Imagen del curso
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="h-24 w-24 rounded object-cover mb-2 shadow"
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

        {/* PDF */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">PDF del curso</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfChange}
            className={`block w-full rounded-lg border p-2 dark:bg-[#1E293B] dark:text-white ${
              errors.pdf ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.pdf && <p className="mt-1 text-sm text-red-600">{errors.pdf}</p>}
        </div>

        {/* ¿Oculto? */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isHidden"
            checked={formData.isHidden}
            onChange={handleChange}
            className="h-5 w-5 accent-yellow-600"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">¿Está oculto?</label>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            ➕ Crear Curso
          </button>
        </div>
      </form>
    </section>
  );
}
