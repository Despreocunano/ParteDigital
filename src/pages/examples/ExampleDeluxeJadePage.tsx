import { DeluxeJadeTemplate } from '../../components/landing/templates/deluxe_jade';

export default function ExampleDeluxeJadePage() {
  return (
    <DeluxeJadeTemplate
      groomName="Juan"
      brideName="María"
      weddingDate={new Date('2025-12-20T17:00:00').toISOString()}
      welcomeMessage="¡Bienvenidos a nuestra boda! Nos alegra compartir este día tan especial con ustedes."
      hashtag="#JuanYMaria2025"
      ceremonyDate={new Date('2025-12-20T17:00:00').toISOString()}
      ceremonyTime="17:00"
      ceremonyLocation="Iglesia San Pedro"
      ceremonyAddress="Av. Principal 123, Santiago"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-12-20T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Centro de Eventos La Casona"
      partyAddress="Camino Real 456, Santiago"
      partyPlaceId="ChIJ0987654321"
      musicEnabled={true}
      musicUrl="https://res.cloudinary.com/sorostica/video/upload/v1750387028/Bruno_Mars_-_Marry_You_Lyrics_NXTca1xc6O4_pgl1aw.mp3"
      coverImage="https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/338_psip7x.jpg"
      galleryImages={[
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2149868548_c8judk.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/18047_zzca9u.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2149155580_phgipy.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/18112_redbdd.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2148768327_jctnyu.jpg"
      ]}
      userId="demo-user-id"
      bankInfo={{
        accountHolder: "Juan Pérez",
        rut: "12.345.678-9",
        bank: "Banco Estado",
        accountType: "Cuenta Corriente",
        accountNumber: "123456789",
        email: "juan@email.com"
      }}
      dress_code="Formal"
      additional_info="La celebración será al aire libre."
      accepts_kids={true}
      accepts_pets={false}
      couple_code="JUANMARIA2024"
      store="https://listaderegalos.com/juan-maria"
    />
  );
} 