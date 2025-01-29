"use client"
import { useEffect, useState } from 'react';

const SVGComponent = ({ url, className, alt = "image" }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(url);
                const text = await response.text();
                
                // Tarkistetaan SVG-sisältö
                if (text.includes('<?xml') && text.includes('<svg')) {
                    // Muokataan SVG:n kokoa
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'image/svg+xml');
                    const svgElement = doc.querySelector('svg');
                    
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        if (className) {
                            svgElement.setAttribute('class', className);
                        }
                        setSvgContent(svgElement.outerHTML);
                    } else {
                        setSvgContent(text);
                    }
                } else {
                    setSvgContent(null);
                }
            } catch (error) {
                console.log('Virhe ladattaessa kuvaa:', error);
                setError(error.message);
                setSvgContent(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (url) {
            loadImage();
        }
    }, [url, className]);

    if (isLoading) {
        return <div className={className}>Loading...</div>;
    }

    if (error) {
        return <div className={className}>Error: {error}</div>;
    }

    if (!svgContent) {
        return (
            <img
                src={url}
                alt={alt}
                className={className}
            />
        );
    }

    return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default SVGComponent;