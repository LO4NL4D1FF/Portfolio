import Image from 'next/image';

/**
 * Screen area of /images/devices/iphone-17.png (388 x 800), measured from its
 * transparent cut-out: x 16..371, y 14..785. Content sits under the frame.
 */
export const SCREEN_INSET = { left: '4.12%', right: '4.12%', top: '1.75%', bottom: '1.75%' };
export const SCREEN_RADIUS = '14.5% / 6.7%';
export const FRAME_SRC = '/images/devices/iphone-17.png';

interface PhoneFrameProps {
  src: string;
  alt: string;
  width: number;
}

/** A real screenshot inside the real iPhone 17 frame. */
export default function PhoneFrame({ src, alt, width }: PhoneFrameProps) {
  return (
    <div className="relative aspect-[388/800] shrink-0 drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" style={{ width }}>
      <div className="absolute overflow-hidden bg-black" style={{ ...SCREEN_INSET, borderRadius: SCREEN_RADIUS }}>
        <Image src={src} alt={alt} fill sizes={`${width}px`} className="object-cover object-top" />
      </div>
      <Image src={FRAME_SRC} alt="" width={388} height={800} className="pointer-events-none absolute inset-0 h-full w-full select-none" />
    </div>
  );
}
