import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
  image?: string;
  pdf?: string;
  teacher_id: string;
  isHidden: boolean;
}

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  course: Course;
  teacher: any;
}

export default function EditCourse({ course, teacher }: Props) {

  const [formData, setFormData] = useState({
    name: course.name,
    description: course.description,
    duration: course.duration,
    teacher_id: course.teacher_id,
    isHidden: course.isHidden,
  });

  const [imagePreview, setImagePreview] = useState(
    course.image ? `${window.location.origin}/${course.image}` : ''
  );
  const [fileImage, setFileImage] = useState<File | null>(null);

  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState(course.pdf || '');

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
      setExistingPdf('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('teacher_id', teacher);

    if (fileImage) data.append('image', fileImage);
    if (filePdf) data.append('pdf', filePdf);

    data.append('_method', 'PUT');

    router.post(`/profile/${course.id}/storeCourse`, data, {
      preserveScroll: true,
     
    });
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-[#101828]">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">✏️ Editar Curso</h2>

<form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
  {/* Nombre */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nombre del curso *</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
      minLength={3}
      placeholder="Introduce el nombre del curso"
      className="w-full mt-1 rounded-lg border border-gray-300 p-3 dark:bg-[#1E293B] dark:text-white"
    />
  </div>

  {/* Descripción */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Descripción *</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={4}
      minLength={10}
      placeholder="Escribe una breve descripción del curso"
      required
      className="w-full mt-1 rounded-lg border border-gray-300 p-3 dark:bg-[#1E293B] dark:text-white"
    />
  </div>

  {/* Imagen */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Imagen del curso</label>
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Vista previa"
        className="h-24 w-24 rounded object-cover mb-2 shadow"
      />
    )}
    <input
      type="file"
      accept="image/jpeg, image/png, image/webp"
      onChange={handleImageChange}
      className="block w-full rounded-lg border border-gray-300 p-2 dark:bg-[#1E293B] dark:text-white"
    />
    {course.image && !fileImage && (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Imagen actual: <code>{course.image}</code>
      </p>
    )}
  </div>

  {/* PDF */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">PDF del curso *</label>
    <input
      type="file"
      accept="application/pdf"
      required
      onChange={handlePdfChange}
      className="block w-full rounded-lg border border-gray-300 p-2 dark:bg-[#1E293B] dark:text-white"
    />
    {existingPdf && (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        PDF actual: <code>{existingPdf}</code>
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
