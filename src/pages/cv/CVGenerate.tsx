import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CVPreview from './CVPreview';

const CVGenerate: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleExportPdf = async () => {
        if (!componentRef.current) return;

        setIsLoading(true);

        try {
            const images = componentRef.current.getElementsByTagName('img');
            const imagePromises = Array.from(images).map(img => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const htmlImg = img as HTMLImageElement;

                    if (htmlImg.complete) {
                        resolve(htmlImg);
                    } else {
                        htmlImg.onload = () => resolve(htmlImg);
                        htmlImg.onerror = (error) => reject(error);
                    }
                });
            });

            await Promise.all(imagePromises);

            const canvas = await html2canvas(componentRef.current, {
                scale: 4,   // High scale for high-resolution capture
                proxy: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid',
                useCORS: true,
                logging: false,
                allowTaint: true,
                imageTimeout: 20000,
                scrollX: 0,
                scrollY: -window.scrollY,
                backgroundColor: '#ffffff'
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

            const marginX = 0;
            const marginY = 0;
            pdf.addImage(
                imgData,
                'JPEG',
                marginX,
                marginY,
                scaledWidth,
                scaledHeight
            );

            pdf.save('cv-export.pdf');
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF. Please check your network and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <div
                ref={componentRef}
                className="flex flex-col items-center"
            >
                <CVPreview />
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleExportPdf}
                    disabled={isLoading}
                    className={`
                        px-6 py-3 rounded-lg transition-colors duration-300
                        ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                    `}
                >
                    {isLoading ? 'Exporting...' : 'Export to PDF'}
                </button>
            </div>
        </div>
    );
};

export default CVGenerate;
