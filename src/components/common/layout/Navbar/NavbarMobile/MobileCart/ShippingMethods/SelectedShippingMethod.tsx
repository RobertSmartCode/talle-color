import { useState, useEffect, useContext } from 'react';
import { ShippingMethod } from "../../../../../../../type/type";
import { CartContext } from '../../../../../../../context/CartContext';



const useSelectedShippingMethod = () => {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(() => {
    // Leer el método de envío seleccionado desde el localStorage al inicializar el estado
    const storedMethod = localStorage.getItem("selectedShippingMethod");
    return storedMethod ? JSON.parse(storedMethod) : null;
  });

  const { getSelectedShippingMethod } = useContext(CartContext)! ?? {};
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  useEffect(() => {
    const initializeSelectedMethod = async () => {
      const initialSelectedMethod = selectedShippingMethod || getSelectedShippingMethod();
      await setSelectedShippingMethod(initialSelectedMethod);

      // Guardar el método de envío seleccionado en el localStorage
      localStorage.setItem("selectedShippingMethod", JSON.stringify(initialSelectedMethod));
    };

    initializeSelectedMethod();
  }, [getSelectedShippingMethod, selectedShippingMethod]);

  const handleShippingMethodSelect = async (method: ShippingMethod) => {
    try {
      // Desseleccionar cualquier método de envío existente
      const updatedMethods = methods.map((m: any) => ({
        ...m,
        selected: false,
      }));
  
      // Seleccionar el nuevo método de envío
      const updatedMethod = updatedMethods.find((m: any) => m.id === method.id);
      if (updatedMethod) {
        updatedMethod.selected = true;
  
        // Actualizar el estado de forma asincrónica
        await new Promise((resolve) => setMethods(updatedMethods)); // Corregir aquí
  
        // Supongo que onSelectMethod y saveMethodsToLocalStorage son funciones disponibles en tu código
        onSelectMethod(method); // Corregir aquí
        saveMethodsToLocalStorage(); // Corregir aquí
      }
    } catch (error) {
      console.error("Error al seleccionar el método de envío:", error);
    }
  };
  

  return { selectedShippingMethod, handleShippingMethodSelect };
};

export default useSelectedShippingMethod;
