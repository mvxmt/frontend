import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/Dialog/Dialog"
import { useGradingModels, useModels, useModelSettings, useSettingsMutation } from "@/utils/chatSettings/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react"
import { useRef, useState } from "react";

export default function SettingsDialog({ }) {
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const models = useModels()
    const gradingModels = useGradingModels()
    const settings = useModelSettings();
    const saveSettings = useSettingsMutation()
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (formRef.current) {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const model = String(formData.get("model"));
            const distance = Number(formData.get("distance"));
            const chunks = Number(formData.get("chunks"));
            const grading = Boolean(formData.get("grading"));
            const grading_model = String(formData.get("gradingModel"));

            saveSettings.mutate({ model, distance, chunks, grading, grading_model }, {
                onSuccess() {
                    setOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["modelSettings"] });
                    queryClient.invalidateQueries({ queryKey: ["models"] });
                    queryClient.invalidateQueries({ queryKey: ["gradingModels"] });
                }
            });
        }
    };
    return (

        <Dialog open={open} onOpenChange={isOpen => {
            setOpen(isOpen)
            if (isOpen) {
                models.refetch();
                gradingModels.refetch();
                console.log(gradingModels.data);
                settings.refetch();
            }
        }}>
            <DialogTrigger asChild>
                <button type="button" className="py-4 font-sans" onClick={() => setOpen(true)}><Settings color="#fff" /></button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form ref={formRef} onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>LLM Settings</DialogTitle>
                        <DialogDescription>
                            Change Model Settings
                        </DialogDescription>
                    </DialogHeader>
                    <FillContent
                        settings={settings.data}
                        models={models}
                        gradingModels={gradingModels} />
                    <DialogFooter>
                        <button type="submit"
                            className="bg-background px-10 py-3 font-sans text-lg font-semibold text-secondary">
                            Save Settings
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
};

function FillContent({ settings, models, gradingModels }) {
    const [grading, setGrading] = useState(() => settings?.grading ?? false);
    return (
        <div className="flex flex-col gap-4 py-4 ">
            <div className="flex flew-row items-center gap-4 my-2">
                <label htmlFor="grading" className="w-20 text-center font-sans text-secondary font-semibold">
                    Relevance Grading
                </label>
                <input
                    id="grading"
                    placeholder="5"
                    type="checkbox"
                    checked={grading}
                    onChange={() => setGrading((prev) => !prev)}
                    className="bg-background p-2"
                    name="grading"
                />
                <span className="text-sm font-sans text-secondary">
                    Toggles relevance grading. If on gives more relevant answer but slows down, if off uses all fetched context but might not be relevant.
                </span>
            </div>
            <div className="flex flew-row items-center gap-4 my-2">
                <select
                    id="gradingModel"
                    className="bg-background font-sans text-secondary w-auto p-2"
                    name="gradingModel"
                    disabled={!grading}
                    defaultValue={settings?.gradingModel}
                >
                    {gradingModels?.data?.map((model) => (
                        <option
                            key={model}
                            value={model}
                        >
                            {model}
                        </option>
                    ))}
                </select>
                <span className="text-sm font-sans text-secondary">
                    Select which model you want to grade your responses
                </span>
            </div>
            <div className="flex flew-row items-center gap-4 my-2">
                <label htmlFor="distance" className="w-20 text-center font-sans text-secondary font-semibold">
                    Distance
                </label>
                <input
                    id="distance"
                    placeholder="5"
                    type="number" max="99" min="1"
                    defaultValue={settings?.distance ?? 5}
                    className="bg-background font-sans text-secondary w-16 p-2"
                    name="distance"
                />
                <span className="text-sm font-sans text-secondary">
                    The smaller the value the more accurate your context is, but results in a lower amount being retrieved.
                </span>
            </div>
            <div className="flex flew-row items-center gap-4 my-2">
                <label htmlFor="chunks" className="w-20 text-center font-sans text-secondary font-semibold">
                    Chunks
                </label>
                <input
                    id="chunks"
                    placeholder="5"
                    defaultValue={settings?.chunks ?? 10}
                    type="number" min="1" max="99"
                    className="bg-background font-sans text-secondary w-16 p-2"
                    name="chunks"
                />
                <span className="text-sm font-sans text-secondary">
                    The higher the value the more context can be retrieved, but the slower the response will be.
                </span>
            </div>
            <div className="flex flew-row items-center gap-4 my-2">
                <label htmlFor="models" className="w-20 text-center font-sans text-secondary font-semibold">
                    Models
                </label>
                <select
                    id="model"
                    className="bg-background font-sans text-secondary w-auto p-2"
                    name="model"
                    defaultValue={settings?.model}
                >
                    {models?.data?.map((model) => (
                        <option
                            key={model}
                            value={model}
                        >
                            {model}
                        </option>
                    ))}
                </select>
                <span className="text-sm font-sans text-secondary">
                    Select which model you want to generate a response.
                </span>
            </div>
        </div>
    );
}
