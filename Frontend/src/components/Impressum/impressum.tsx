import React from "react";

const Impressum: React.FC = () => {
    return (
        <div className="container mx-auto min-vh-100" style={{ marginTop: "-9%", padding: "4%", paddingTop: "10%" }}>
            <h1 className="text-2xl font-bold mb-4">Impressum</h1>
            <p>
                <strong>GourmetGuide</strong>
            </p>
            <p>
                Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV: <br />
                Carlo Gliech
            </p>
            <p>
                <strong>Adresse:</strong> <br />
                Hochschule für Wirtschaft und Recht Berlin <br />
                Alt-Friedrichsfelde 60<br />
                10315 Berlin
            </p>
            <p>
                <strong>E-Mail:</strong> <br />
                <a href="mailto:help@gourmet-guide.com" className="text-blue-500 underline">
                    help@gourmet-guide.com
                </a>
            </p>
            <p className="mt-4 text-sm text-gray-600">
                Hinweis: Diese Seite wurde im Rahmen eines Hochschulprojekts an der HWR Berlin erstellt. Die angegebene Adresse dient ausschließlich zu Demonstrationszwecken und ist keine offizielle Kontaktmöglichkeit.
            </p>
        </div>
    );
};

export default Impressum;