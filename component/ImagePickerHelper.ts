import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export async function pickImageFromLibrary(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      if (Platform.OS === 'web') window.alert('Permission requise\n\nAutorisez l\'accès à la galerie pour ajouter une image');
      else Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour ajouter une image");
      return null;
    }

    const attempts: Array<any> = [
      { mediaTypes: ImagePicker.MediaTypeOptions.Images },
      { mediaTypes: ImagePicker.MediaTypeOptions.All },
      {}, 
    ];

    for (const opts of attempts) {
      try {
        const res = await ImagePicker.launchImageLibraryAsync({ ...opts, quality: 0.8, allowsEditing: true });
        if (!res) continue;
        if (res.canceled) continue;
        const uri = res.assets ? res.assets[0]?.uri : (res as any).uri;
        if (uri) return uri;
      } catch (e) {
      }
    }

    return null;
  } catch (e: any) {
    if (Platform.OS === 'web') window.alert(`Erreur\n\n${e?.message ?? 'Impossible de sélectionner une image'}`);
    else Alert.alert('Erreur', e?.message ?? 'Impossible de sélectionner une image');
    return null;
  }
}

export default pickImageFromLibrary;
