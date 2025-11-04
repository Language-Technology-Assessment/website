import ModelsToGuide from "~/repos/models-in-guides.json?raw";

const modelsToGuide = ref(JSON.parse(ModelsToGuide));

export const useModelsToGuide = () => {
  return {
    modelsToGuide,
  };
};
