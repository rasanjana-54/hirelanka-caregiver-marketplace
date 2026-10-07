import caregiverFallbackImage from '../assets/images/avatar_nadeesha_1791048994074.jpg';
import agencyFallbackImage from '../assets/images/agency_suwasevana_1791049030798.jpg';

export { caregiverFallbackImage, agencyFallbackImage };

export const handleImageFallback = (event, fallbackImage) => {
    const image = event.currentTarget;
    if (image.src !== new URL(fallbackImage, document.baseURI).href) {
        image.src = fallbackImage;
    }
};
