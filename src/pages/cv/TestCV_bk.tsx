import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import CVPreview from './CVPreview';
import CVPreview_old from './CVPreview_old';

const TestCV: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const preloadImages = async (element: HTMLElement): Promise<void> => {
        const images = element.getElementsByTagName('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise<void>((resolve, reject) => {
                const htmlImg = img as HTMLImageElement;

                if (htmlImg.complete) {
                    resolve();
                    return;
                }

                htmlImg.onload = () => resolve();
                htmlImg.onerror = () => {
                    console.warn(`Failed to load image: ${htmlImg.src}`);
                    resolve(); // Resolve anyway to continue process
                };

                // Force image to load
                if (htmlImg.src) {
                    htmlImg.src = htmlImg.src;
                }
            });
        });

        await Promise.all(imagePromises);
    };

    const handleExportPdf = async () => {
        if (!componentRef.current) return;

        setIsLoading(true);

        try {
            // Preload images
            await preloadImages(componentRef.current);

            const opt = {
                margin: [10, 10, 10, 10], // top, right, bottom, left
                filename: 'cv-export.pdf',
                image: {
                    type: 'jpeg',
                    quality: 1 // Maximum quality
                },
                html2canvas: {
                    scale: 4, // Higher scale for better quality
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: { mode: 'avoid-all' }
            };

            html2pdf()
                .set(opt)
                .from(componentRef.current)
                .save()
                .then(() => {
                    setIsLoading(false);
                });
        } catch (error) {
            console.error('PDF Export Error:', error);
            setIsLoading(false);
            alert('Failed to export PDF. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div
                ref={componentRef}
                className="w-full h-auto bg-white"
            >
                <CVPreview_old />
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

export default TestCV;