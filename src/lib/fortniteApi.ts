

const FORTNITE_API_URL = 'https://fortnite-api.com/v2/shop?language=es';
const API_KEY = 'cc11a503-e92f-4a69-afe4-b88d37da98ff';

export interface FortniteItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  image: string;
  category?: string;
  bundle?: {
    name: string;
    info: string;
    image: string;
  };
}

export interface FortniteShopSections {
  sections: {
    name: string;
    items: FortniteItem[];
  }[];
  all: FortniteItem[];
}

// Rarity map
const rarityMap: Record<string, string> = {
  'common': 'Común',
  'uncommon': 'Poco común',
  'rare': 'Raro',
  'epic': 'Épico',
  'legendary': 'Legendario',
  'marvel': 'Serie Marvel',
  'dc': 'Serie DC',
  'icon': 'Serie de Ídolos',
  'starwars': 'Serie de Star Wars',
  'gaminglegends': 'Leyendas de Videojuegos',
  'shadow': 'Serie Sombría',
  'slurp': 'Serie Sorbete'
};

export const getFortniteShop = async (): Promise<FortniteShopSections> => {
  try {
    const response = await fetch(FORTNITE_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const entries = data.data.entries;
    
    const all: FortniteItem[] = [];
    const sectionMap: Record<string, FortniteItem[]> = {};

    entries.forEach((entry: any) => {
      const item = entry.brItems?.[0] || entry.items?.[0] || {};
      const bundle = entry.bundle;
      const track = entry.tracks?.[0];
      
      if (!item.id && !bundle && !track) return;
      
      let name = bundle?.name || item.name || track?.title || 'Desconocido';
      if (name === 'Desconocido' && entry.devName) {
        const match = entry.devName.match(/\d+\s*x\s*([^,]+?)(?:\s+for\s+|\s*,)/i);
        if (match && match[1]) name = match[1].trim();
      }
      
      let description = item.description || '';
      if (bundle) description = bundle.info || `Lote con contenido exclusivo`;
      else if (track) description = `${track.artist} - ${track.releaseYear || 'N/A'}`;
      
      let type = item.type?.displayValue || item.type?.value || 'Item';
      if (bundle) type = 'Lote (Bundle)';
      else if (track) type = 'Pista Musical';
      
      const rarityRaw = item.rarity?.value?.toLowerCase() || 'common';
      const rarity = rarityMap[rarityRaw] || rarityRaw;
      
      let image = '';
      if (track?.albumArt) image = track.albumArt;
      else if (bundle?.image) image = bundle.image;
      else if (item.images?.featured) image = item.images.featured;
      else if (item.images?.icon) image = item.images.icon;
      else if (item.images?.smallIcon) image = item.images.smallIcon;
      else if (entry.newDisplayAsset?.renderImages?.[0]?.image) image = entry.newDisplayAsset.renderImages[0].image;
      else if (entry.newDisplayAsset?.materialInstances?.[0]?.images?.OfferImage) image = entry.newDisplayAsset.materialInstances[0].images.OfferImage;
      
      // Fallback
      if (!image) {
        const typeColors: Record<string, string> = {
          'outfit': '8b5cf6', 'emote': 'f59e0b', 'pickaxe': 'fbbf24', 'glider': '7c3aed', 'wrap': 'a78bfa'
        };
        const color = typeColors[type.toLowerCase()] || '6b7280';
        image = `https://placehold.co/512x512/${color}/ffffff?text=${encodeURIComponent(type)}`;
      }

      const itemId = bundle ? entry.offerId : (item.id || entry.offerId || `item-${Date.now()}`);

      const transformed: FortniteItem = {
        id: itemId,
        name: name,
        description: description,
        type,
        rarity,
        price: entry.finalPrice || 0,
        image,
        bundle: bundle ? {
          name: bundle.name,
          info: bundle.info,
          image: bundle.image
        } : undefined
      };

      all.push(transformed);

      const sectionName = entry.section?.name || entry.layout?.name || 'Otros';
      if (!sectionMap[sectionName]) {
        sectionMap[sectionName] = [];
      }
      sectionMap[sectionName].push(transformed);
    });

    const sections = Object.entries(sectionMap).map(([name, items]) => ({
      name,
      items
    }));

    const isMusicSection = (section: any) => {
      const name = section.name.toLowerCase();
      return name.includes('jam') || name.includes('track') || name.includes('música') || name.includes('canciones') || section.items.every((i: any) => i.type === 'Pista Musical');
    };

    sections.sort((a, b) => {
      return (isMusicSection(a) ? 1 : 0) - (isMusicSection(b) ? 1 : 0);
    });

    // Sort all to push Pista Musical to the bottom
    all.sort((a, b) => {
      const aIsMusic = a.type === 'Pista Musical' ? 1 : 0;
      const bIsMusic = b.type === 'Pista Musical' ? 1 : 0;
      return aIsMusic - bIsMusic;
    });

    return { sections, all };

  } catch (error) {
    console.error('Error fetching Fortnite shop:', error);
    return { sections: [], all: [] };
  }
};
