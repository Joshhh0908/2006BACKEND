// models/recommendation.js
class Recommendation {
    static collection = 'recommendations';
  
    static async generateOutfit(db, userId, params) {
      // In a real application, this would call an AI service
      // For now, we'll use a simple algorithm based on weather and occasion
      
      // Get all clothing items for the user
      const clothingSnapshot = await db.collection('clothingItems')
        .where('userId', '==', userId)
        .get();
      
      const userClothes = clothingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Basic outfit selection logic
      const tops = userClothes.filter(item => item.category === 'tops');
      const bottoms = userClothes.filter(item => item.category === 'bottoms');
      const footwear = userClothes.filter(item => item.category === 'footwear');
      const accessories = userClothes.filter(item => item.category === 'accessories');
      const outerwear = userClothes.filter(item => item.category === 'outerwear');
      
      const outfit = [];
      let notes = '';
      
      // Select a top
      if (tops.length > 0) {
        const selectedTop = this.selectItemForOccasion(tops, params.occasion);
        outfit.push(selectedTop);
      }
      
      // Select bottoms
      if (bottoms.length > 0) {
        const selectedBottoms = this.selectItemForOccasion(bottoms, params.occasion);
        outfit.push(selectedBottoms);
      }
      
      // Select footwear
      if (footwear.length > 0) {
        const selectedFootwear = this.selectItemForOccasion(footwear, params.occasion);
        outfit.push(selectedFootwear);
      }
      
      // Add accessories for formal occasions
      if (params.occasion === 'formal' && accessories.length > 0) {
        const selectedAccessory = this.selectItemForOccasion(accessories, params.occasion);
        outfit.push(selectedAccessory);
      }
      
      // Add outerwear based on temperature
      if (params.temperature < 20 && outerwear.length > 0) {
        const selectedOuterwear = this.selectItemForOccasion(outerwear, params.occasion);
        outfit.push(selectedOuterwear);
      }
      
      // Generate recommendation notes
      switch (params.occasion) {
        case 'formal':
          notes = 'This formal outfit creates a polished and sophisticated look suitable for business meetings or special events.';
          break;
        case 'casual':
          notes = 'This casual outfit offers comfort and style for everyday activities.';
          break;
        case 'party':
          notes = 'This outfit strikes the perfect balance between style and comfort for a night out.';
          break;
        default:
          notes = 'This outfit is versatile and appropriate for various settings.';
      }
      
      // Save the recommendation
      const recRef = await db.collection(this.collection).add({
        userId,
        outfit,
        params,
        notes,
        createdAt: new Date()
      });
      
      return {
        id: recRef.id,
        outfit,
        notes
      };
    }
    
    static selectItemForOccasion(items, occasion) {
      // Filter for items matching the occasion if available
      const matchingItems = items.filter(item => item.occasion === occasion);
      
      if (matchingItems.length > 0) {
        // Return a random item from matching items
        return matchingItems[Math.floor(Math.random() * matchingItems.length)];
      }
      
      // If no matching items, return a random item
      return items[Math.floor(Math.random() * items.length)];
    }
    
    static async getById(db, recId, userId) {
      const docRef = db.collection(this.collection).doc(recId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new Error('Recommendation not found');
      }
      
      const data = doc.data();
      
      if (data.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      return { id: doc.id, ...data };
    }
  }
  
  module.exports = Recommendation;