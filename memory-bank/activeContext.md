# Aktif Bağlam

## Şu Anki Çalışma
**Phase 1: Foundation** - ✅ COMPLETED

### Son Güncelleme (14 Şubat 2026)

#### Durum
Phase 1 tamamlandı. DI Container ve Event Bus başarıyla implement edildi.

#### Yapılan İşlemler
1. **Core Dizin Yapısı**: `src/js/core/` dizini oluşturuldu
2. **DI Container** (`src/js/core/Container.js`):
   - Singleton ve transient lifecycle desteği
   - Factory-based service registration
   - Dependency injection through container
   - Child container creation (inheritance)
   - Service instantiation tracking (`isInstantiated`)
   - Chaining API (`container.register().register()`)
3. **Event Bus** (`src/js/core/EventBus.js`):
   - `on()`, `off()`, `emit()`, `once()` metodları
   - Unsubscribe function return pattern
   - Async emit desteği (`emitAsync`)
   - Event history recording (debug için)
   - Error handling in handlers (devam eden execution)
4. **Core Module Index** (`src/js/core/index.js`):
   - Named exports for Container and EventBus
5. **Unit Tests**:
   - `tests/core/Container.test.js` - 25+ test case
   - `tests/core/EventBus.test.js` - 30+ test case

#### Proje Durumu
- **Versiyon**: v8.3.2-dev
- **Build**: `pnpm run build` → `dist/index.html`
- **Mimari**: State-Renderer-Actions (15 modüler JS dosyası)
- **Core**: DI Container + Event Bus (yeni)
- **Veri**: localStorage (tarayıcı yerel depolama)
- **Test**: Custom test framework + Core unit tests ✅

### Sonraki Adımlar (Phase 2: Configuration Extraction)
1. `src/js/config/` dizini oluşturulması
2. Storage keys extraction (`keys.js`)
3. Validation limits extraction (`validation.js`)
4. Theme constants extraction (`theme.js`)
5. Targets configuration (`targets.js`)

## Tamamlanan Sürümler
- ✅ Phase 1: Foundation (14 Şubat 2026) - DI Container, Event Bus
- ✅ Phase 0: Test Infrastructure (14 Şubat 2026)
- ✅ v8.3.1: Security documentation reconciliation (docs-only, version bump yok)
- ✅ v8.3.1: Documentation finalize, pnpm migration
- ✅ v8.3.0: Dynamic Set Management
- ✅ v8.2.0: Nutrition Tab Redesign
- ✅ v8.1.1: Training Tab UI/UX
- ✅ v8.1.0: Stealth Mode
- ✅ v8.0.0: Modular Build

## Aktif Kararlar ve Desenler

### DI Container Kullanım Deseni
```javascript
// Service registration
container.register('eventBus', () => new EventBus());
container.register('store', (c) => new Store(c.get('eventBus')));

// Singleton (default) - same instance every time
container.register('config', () => new Config());

// Transient - new instance every time
container.register('logger', () => new Logger(), 'transient');
```

### Event Bus Kullanım Deseni
```javascript
// Subscribe with auto-unsubscribe
const unsubscribe = eventBus.on('store:change', (state) => {
    console.log('State updated:', state);
});

// One-time subscription
eventBus.once('app:ready', () => initializeApp());

// Emit events
eventBus.emit('user:login', { id: 1, name: 'John' });

// Cleanup
unsubscribe();
```

### Öğrenilen Dersler
1. **Private Fields**: ES2022 private fields (`#`) kullanımı modern browser'larda çalışır
2. **Factory Pattern**: Factory functions container'ı alarak dependency resolution yapabilir
3. **Unsubscribe Pattern**: `on()` metodunun unsubscribe function döndürmesi cleanup'i kolaylaştırır
4. **Error Isolation**: Event handler'larda try-catch kullanımı bir handler hatasının diğerlerini etkilemesini engeller
