export default function Benefits() {
    const benefits = [
        "✅ Más visibilidad en la plataforma",
        "✅ Perfil destacado en búsquedas",
        "✅ Soporte técnico prioritario",
        "✅ Perfil verificado",
    ]

    return (
        <section className="bg-primary text-white borders p-6 rounded-2xl shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ventajas de ser Premium</h2>
            <ul className="list-disc pl-5 space-y-2">
                {benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                ))}
            </ul>
        </section>
    )
}
