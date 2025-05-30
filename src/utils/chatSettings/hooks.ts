import { useMutation, useQuery } from "@tanstack/react-query"
import { getGradingModels, getModels, getModelSettings, saveUserSettings } from ".";
import { ModelSettings } from ".";

export const useModelSettings = () => {
  const query = useQuery({
    queryKey: ["modelSettings"],
    queryFn: async () => {
      return getModelSettings();
    },
  });
  return query;
};

export const useModels = () => {
  const query = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      return getModels();
    },
    enabled:false
  });
  return query;
};

export const useGradingModels = () => {
  const query = useQuery({
    queryKey: ["gradingModels"],
    queryFn: async () => {
      return getGradingModels();
    },
    enabled:false
  });
  return query;
};

export const useSettingsMutation = () =>{
  return useMutation({
    mutationFn: (body:ModelSettings) => saveUserSettings(body),
  });
};