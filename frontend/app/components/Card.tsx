interface CardProps {
  imageSrc: string;
  altText: string;
}

export default function Card({ imageSrc, altText }: CardProps) {
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg ">
      <img
        src={imageSrc}
        alt={altText}
        className="max-h-[400px] max-w-[400px] rounded-lg block"
      />
    </div>
  );
}
