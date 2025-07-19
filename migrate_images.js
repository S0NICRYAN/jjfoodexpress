// Migration script to convert base64 images to Firebase Storage
// Run this script once to migrate all your product images

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Import your Firebase config
import { firebaseConfig } from './secrets.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to convert base64 to blob
function base64ToBlob(base64String) {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convert base64 to binary
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
}

// Function to upload image to Firebase Storage
async function uploadImageToStorage(imageBlob, productId) {
    try {
        const imageRef = ref(storage, `products/${productId}.jpg`);
        await uploadBytes(imageRef, imageBlob);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    } catch (error) {
        console.error(`Error uploading image for product ${productId}:`, error);
        return null;
    }
}

// Main migration function
async function migrateImages() {
    try {
        console.log('Starting image migration...');
        
        // Get all products from Firestore
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        let migratedCount = 0;
        let errorCount = 0;
        
        // Process each product
        for (const productDoc of productsSnapshot.docs) {
            const productId = productDoc.id;
            const productData = productDoc.data();
            
            // Check if product has base64 image data
            if (productData.imageData && productData.imageData.startsWith('data:image')) {
                console.log(`Processing product: ${productData.name} (${productId})`);
                
                try {
                    // Convert base64 to blob
                    const imageBlob = base64ToBlob(productData.imageData);
                    
                    // Upload to Firebase Storage
                    const imageUrl = await uploadImageToStorage(imageBlob, productId);
                    
                    if (imageUrl) {
                        // Update Firestore document with new image URL
                        const productRef = doc(db, 'products', productId);
                        await updateDoc(productRef, {
                            imageUrl: imageUrl,
                            // Remove the old base64 data to save space
                            imageData: null
                        });
                        
                        console.log(`✅ Migrated: ${productData.name} -> ${imageUrl}`);
                        migratedCount++;
                    } else {
                        console.error(`❌ Failed to upload image for: ${productData.name}`);
                        errorCount++;
                    }
                    
                    // Add small delay to prevent overwhelming the server
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    console.error(`❌ Error processing ${productData.name}:`, error);
                    errorCount++;
                }
            } else {
                console.log(`⏭️ Skipping ${productData.name} - no base64 image data`);
            }
        }
        
        console.log(`\nMigration completed!`);
        console.log(`✅ Successfully migrated: ${migratedCount} images`);
        console.log(`❌ Errors: ${errorCount} images`);
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Function to test the migration on a single product
async function testMigration() {
    try {
        console.log('Testing migration on a single product...');
        
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        // Find first product with base64 image
        for (const productDoc of productsSnapshot.docs) {
            const productData = productDoc.data();
            
            if (productData.imageData && productData.imageData.startsWith('data:image')) {
                console.log(`Testing with product: ${productData.name}`);
                
                const imageBlob = base64ToBlob(productData.imageData);
                const imageUrl = await uploadImageToStorage(imageBlob, productDoc.id);
                
                if (imageUrl) {
                    console.log(`✅ Test successful! Image URL: ${imageUrl}`);
                    console.log('You can now run the full migration.');
                } else {
                    console.log('❌ Test failed');
                }
                break;
            }
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Export functions for use in browser console
window.migrateImages = migrateImages;
window.testMigration = testMigration;

console.log('Migration script loaded!');
console.log('To test: testMigration()');
console.log('To migrate all images: migrateImages()'); 