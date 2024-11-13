import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CVPreview from './CVPreview';

const CVGenerate: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleExportPdf = async () => {
        if (!componentRef.current) return;

        try {
            // Preload images to ensure they render correctly
            // const images = componentRef.current.getElementsByTagName('img');
            // const imagePromises = Array.from(images).map(img => {
            //     return new Promise((resolve, reject) => {
            //         if (img.complete) {
            //             resolve(img);
            //         } else {
            //             img.onload = () => resolve(img);
            //             img.onerror = reject;
            //         }
            //     });
            // });

            // await Promise.all(imagePromises);

            const canvas = await html2canvas(componentRef.current, {
                scale: 5,
                useCORS: true,
                logging: false,
                allowTaint: true,
                imageTimeout: 15000,
                scrollX: 0,
                scrollY: -window.scrollY
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;

            const marginX = (pdfWidth - scaledWidth) / 2;
            const marginY = (pdfHeight - scaledHeight) / 2;

            pdf.addImage(
                imgData,
                'JPEG',
                marginX,
                marginY,
                scaledWidth,
                scaledHeight
            );

            pdf.save('cv.pdf');
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF. Please try again.');
        }
    };

    return (
        <div className="flex justify-center mt-6">

            <div className="justify-center mr-6">
                <button
                    onClick={handleExportPdf}
                    disabled={isLoading}
                    className={`
                        px-6 py-3 rounded-lg transition-colors duration-300
                        ${isLoading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                    `}
                >
                    {isLoading ? 'Exporting...' : 'Export to PDF'}
                </button>
            </div>

            <div
                ref={componentRef}
                className="flex flex-col items-center"
            >
                <CVPreview />
            </div>
        </div>
    );
};

export default CVGenerate;
