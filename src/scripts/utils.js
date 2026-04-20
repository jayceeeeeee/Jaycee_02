/*
 * constants but free choice from the user about his territory
 * it is the CONTACT POINT here.
 * so there is no rule, only emptiness and free choice.
 * 
 * then for the pixels it is also free in some way but
 *  still depends indirectly on the screen size of the user / materials used on Earth as electronics.
 *  so there is a kind of "objective" measure, but it is still a choice to use it or not, and how to use it.
 *      in reality it is becoming UI art, just like drawing, editing, modeling 3D, everything about technology is a Magical art = IT IS KUJUTSU!
 *      the simple fact that we code it and see the result is making us integrate our space time magically inside already & through the covenant ark.
 *          yes there is indeed 1billion ways to do "ART" on computer because ART is MAGICAL ART not outside art! just needed to find our own way. is it code?
*/

export let RyōikiTenkaiMeters = 10; // our territory in meters // arbitrary
export let RyōikiTenkaiPixels = 0; // our territory in pixels, calculated from screen size
updateRadiusTerritory();

/*
 * functions of proportions
*/

export function updateRadiusTerritory() {
    // Responsive calculation with proportional adjustment
    // We want the radius to be max 40% of the smallest window dimension
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const maxRadiusAllowed = minDimension * 0.25;
    
    RyōikiTenkaiPixels = maxRadiusAllowed;
}