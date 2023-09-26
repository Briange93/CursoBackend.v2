import fs from 'fs';
import { ProductManager } from './productManager.js'; 

export class CartManager{
    #carts;
    #cartDirPath;
    #cartFilePath;
    #fileSystem;


    constructor(){
        this.#carts = new Array();
        this.#cartDirPath = "./Data";
        this.#cartFilePath = this.#cartDirPath + "/Carts.json";

        this.#fileSystem = fs; 
    }


    isCodeDuplicated (id){
        return this.#carts.some(cart => cart.id === id);
    } 



    createCart = async () => {
        let id = this.#carts.length + 1;
        let newCart = { products: [], id: id };
        try {
          // Creamos el directorio si no existe
            await this.#fileSystem.promises.mkdir(this.#cartDirPath, { recursive: true });
        
            // Verificamos si el archivo existe
            if (!this.#fileSystem.existsSync(this.#cartFilePath)) {
                await this.#fileSystem.promises.writeFile(this.#cartFilePath, '[]');
            }
        
            // Leemos el contenido del archivo de carritos
            let cartsFile = await this.#fileSystem.promises.readFile(this.#cartFilePath, 'utf-8');
        
            // Intentamos analizar el contenido del archivo como JSON
            this.#carts = JSON.parse(cartsFile);
        
            // Verificamos si el código del carrito ya existe
            if (this.isCodeDuplicated(newCart.id)) {
                return { error: 'El carrito ya existe' };
            }
        
            // Agregamos el nuevo carrito al array
            this.#carts.push(newCart);
        
            // Guardamos el array de carritos actualizado en el archivo
            await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));
            } catch (error) {
            console.error(`Error al crear el carrito nuevo: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
            throw Error(`Error al crear el carrito nuevo: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
            }
        };

        getCartById = async (id) => {
            try{
                //creamos el directorio si no existe
                await this.#fileSystem.promises.mkdir(this.#cartDirPath, {recursive: true});
                
                //verificamos si el archivo existe
                if (!this.#fileSystem.existsSync(this.#cartFilePath)){
                    await this.#fileSystem.promises.writeFile(this.#cartFilePath, '[]');
                }
        
                let cartsFile = await this.#fileSystem.promises.readFile(this.#cartFilePath, 'utf-8');
        
                this.#carts = JSON.parse(cartsFile);
        
                let cart = this.#carts.find(cart => cart.id === id);
                if (cart){
                    return cart;
                }
                
            }
            catch (error){
                console.error(`Error al obtener el producto con id: ${id}, detalle del error: ${error}`);
            }
        };

        addProductToCart = async (cid, pid) => {
            const productManager = new ProductManager();
            try{
                //creamos el directorio si no existe
                await this.#fileSystem.promises.mkdir(this.#cartDirPath, {recursive: true});
                
                //verificamos si el archivo existe
                if (!this.#fileSystem.existsSync(this.#cartFilePath)){
                    await this.#fileSystem.promises.writeFile(this.#cartFilePath, '[]');
                }
        
                let cartsFile = await this.#fileSystem.promises.readFile(this.#cartFilePath, 'utf-8');
        
                this.#carts = JSON.parse(cartsFile);
        
                let cart = this.#carts.find(cart => cart.id === cid);
                const product = await productManager.getProductById(pid)
                const productToAdd = {
                    productId: product.id,
                    quantity: 1
                }
                console.log(productToAdd);

                if (cart) {
                    // Buscamos si el productId ya existe en el carrito
                    const existingProduct = cart.products.find(item => item.productId === productToAdd.productId);
                    if (existingProduct) {
                      // Si el productId ya existe, incrementamos la cantidad en 1
                        existingProduct.quantity += 1;
                    } else {
                      // Si el productId no existe, agregamos el nuevo producto al carrito
                        cart.products.push(productToAdd);
                    }

                    await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));
                    return cart;
                }
            }catch (error){
                console.error(`Error al agregar el producto al carrito: ${id}, detalle del error: ${error}`);
                throw Error(`Error al agregar el producto al carrito: ${id}, detalle del error: ${error}`);
            }
        }
    }
    
/*     getProducts = async () => {
        try{
            //creamos el directorio si no existe
            await this.#fileSystem.promises.mkdir(this.#productDirPath, {recursive: true});
            
            //verificamos si el archivo existe
            if (!this.#fileSystem.existsSync(this.#productFilePath)){
                await this.#fileSystem.promises.writeFile(this.#productFilePath, '[]');
            }
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, 'utf-8');
            console.log(productsFile); 
            this.#products = productsFile;    
            return this.#products;
        }
        catch (error){
            console.error(`Error al obtener los productos: ${error}`);
            throw Error(`Error al obtener los productos: ${error}`);
        }
    }

    getProductById = async (id) => {
        try{
            //creamos el directorio si no existe
            await this.#fileSystem.promises.mkdir(this.#productDirPath, {recursive: true});
            
            //verificamos si el archivo existe
            if (!this.#fileSystem.existsSync(this.#productFilePath)){
                await this.#fileSystem.promises.writeFile(this.#productFilePath, '[]');
            }
    
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, 'utf-8');
    
            this.#products = JSON.parse(productsFile);
    
            let product = this.#products.find(product => product.id === id);
            if (product){
                console.log(`Producto encontrado:`);
                console.log(product);
                return product;
            }
            
        }
        catch (error){
            console.error(`Error al obtener el producto con id: ${id}, detalle del error: ${error}`);
        }
    }

    updateProduct = async (id, producto ) => {
        try{
            //creamos el directorio si no existe
            await this.#fileSystem.promises.mkdir(this.#productDirPath, {recursive: true});
            
            //verificamos si el archivo existe
            if (!this.#fileSystem.existsSync(this.#productFilePath)){
                await this.#fileSystem.promises.writeFile(this.#productFilePath, '[]');
            }
    
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, 'utf-8');
    
            this.#products = JSON.parse(productsFile);
    
            let product = this.#products.find(product => product.id === id);
            
                Object.assign(product, producto);
                await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2));

                
        } catch (error){
            console.error(`Error al actualizar el producto con id: ${id}, detalle del error: ${error}`);
        }
    }

    deleteProduct = async (id) => {
        try{
            //creamos el directorio si no existe
            await this.#fileSystem.promises.mkdir(this.#productDirPath, {recursive: true});
            
            //verificamos si el archivo existe
            if (!this.#fileSystem.existsSync(this.#productFilePath)){
                await this.#fileSystem.promises.writeFile(this.#productFilePath, '[]');
            }
    
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, 'utf-8');
    
            this.#products = JSON.parse(productsFile);
    
            let product = this.#products.find(product => product.id === id);
            
            if (product){
                this.#products = this.#products.filter(product => product.id !== id);
                await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2));
                console.log(`Producto eliminado:`);
                console.log(product);
                console.log(this.#products);
            }
        
        }catch (error){
            console.error(`Error al eliminar el producto con id: ${id}, detalle del error: ${error}`);
        }

    } */




