'use client';
import { useState } from "react";
import { toast } from "sonner";
import emailjs from "emailjs-com";

export default function ContactPage() {
  const [form, setForm] = useState({ title: "", description: "", subject: "Consultas", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setForm({ ...form, [e.target.name]: newValue });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.email) {
      toast.error("Todos los campos son obligatorios!");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Por favor, ingresa un correo electrónico válido!");
      return;
    }

    // Verificamos si las variables de entorno están definidas
    const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Faltan las configuraciones de correo. Por favor, revisa las variables de entorno.");
      return;
    }

    try {
      const result = await emailjs.send(
        serviceId, // Ahora las variables son seguras y no son undefined
        templateId,
        {
          from_name: form.email,
          subject: form.subject,
          title: form.title,
          message: form.description,
        },
        publicKey
      );
      console.log('Email enviado:', result.text);
      toast.success("Mensaje enviado correctamente! En breve nos pondremos en contacto contigo.");
      setForm({ title: "", description: "", subject: "Consultas", email: "" });
    } catch (error) {
      console.error('Error al enviar email:', error);
      toast.error("Hubo un error al enviar el mensaje. Intenta de nuevo.");
    }
  };

  return (
    <div className="container mx-auto my-8 p-4 rounded-md border-2 border-quaternary dark:border-quinary">
      <h4 className="text-2xl text-center font-bold mb-4">¿Tenes alguna consulta?<br />¿Necesitas reportar algún problema?</h4>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="impunts impunts-2"
        >
          <option value="Consultas">Consulta</option>
          <option value="Reportes">Reporte</option>
          <option value="Denuncias">Denuncia</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Tu email"
          value={form.email}
          onChange={handleChange}
          className="impunts impunts-2"
        />
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="impunts impunts-2"
        />
        <textarea
          name="description"
          placeholder="Describe tu mensaje"
          value={form.description}
          onChange={handleChange}
          className="impunts impunts-2 h-[20vh]"
        />
        <button
          type="submit"
          className="w-1/2 mx-auto font-bold py-2 buttons"
        >
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}
