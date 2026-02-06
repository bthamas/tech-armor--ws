import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA3yqDcBjrud7liFr_PdYFtb5_khX7NkPg",
    authDomain: "egyedi-ws.firebaseapp.com",
    projectId: "egyedi-ws",
    storageBucket: "egyedi-ws.firebasestorage.app",
    messagingSenderId: "693161953526",
    appId: "1:693161953526:web:32b302b02d54450688c4d7"
};

const appId = 'egyedi-ws';

let db, auth, storage;
let app;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
} catch (e) {
    console.error("Firebase init failed.", e);
}

export { db, auth, app, storage };

export class TechBackend {
    constructor() {
        this.basePath = ['artifacts', appId, 'public', 'data'];
    }

    async uploadImage(file) {
        if (window.store.state.demoMode || !auth?.currentUser) {
            return URL.createObjectURL(file);
        }
        try {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (e) {
            console.error("Upload failed", e);
            alert("Képfeltöltés sikertelen: " + e.message);
            return null;
        }
    }

    coll(n) {
        return collection(db, ...this.basePath, n);
    }

    doc(n, i) {
        return doc(db, ...this.basePath, n, i);
    }

    async fetchAll(n) {
        if (window.store.state.demoMode || !auth?.currentUser) return this.getLocal(n);
        try {
            const s = await getDocs(this.coll(n));
            const d = s.docs.map(x => ({
                id: x.id,
                ...x.data()
            }));
            this.setLocal(n, d);
            return d;
        } catch (e) {
            if (e.code === 'permission-denied') window.store.activateDemoMode();
            return this.getLocal(n);
        }
    }

    async save(n, d) {
        if (window.store.state.demoMode || !auth?.currentUser) {
            let items = this.getLocal(n);
            if (d.id) items = items.map(x => x.id === d.id ? d : x);
            else {
                d.id = 'L' + Date.now();
                items.push(d);
            }
            this.setLocal(n, items);
            return d.id;
        }
        try {
            if (d.id) {
                const id = d.id;
                const clean = {
                    ...d
                };
                delete clean.id;
                await setDoc(this.doc(n, id), clean, {
                    merge: true
                });
                return id;
            }
            const res = await addDoc(this.coll(n), d);
            return res.id;
        } catch (e) {
            window.store.activateDemoMode();
            return this.save(n, d);
        }
    }

    async delete(n, i) {
        if (window.store.state.demoMode || !auth?.currentUser) {
            this.setLocal(n, this.getLocal(n).filter(x => x.id !== i));
            return;
        }
        try {
            await deleteDoc(this.doc(n, i));
        } catch (e) {
            window.store.activateDemoMode();
        }
    }

    // Settings specific save
    async saveSettings(data) {
        if (window.store.state.demoMode || !auth?.currentUser) {
            localStorage.setItem('ta_settings', JSON.stringify(data));
            return;
        }
        try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'settings'), data, { merge: true });
        } catch (e) {
            console.error("Settings save failed", e);
            localStorage.setItem('ta_settings', JSON.stringify(data));
        }
    }

    getLocal(n) {
        return JSON.parse(localStorage.getItem(`ta_v6_${n}`)) || [];
    }
    setLocal(n, d) {
        localStorage.setItem(`ta_v6_${n}`, JSON.stringify(d));
    }
}
