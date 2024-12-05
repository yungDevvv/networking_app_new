"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Button } from '@/components/ui/button';
import DatePicker from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/use-modal';
import { Eye, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const minutes = ["00", "15", "30", "45"];
const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00"];

const formSchema = z.object({
    eventType: z.string().min(1, {
        message: "Valitse tapahtumatyyppi."
    }),
    clientName: z.string().min(1, "Asiakkaan nimi vaaditaan."),
    groupSize: z.preprocess((val) => Number(val), z.number().positive("Ryhmän koon on oltava suurempi kuin 0.")),
    eventAddress: z.string().min(1, "Tapahtuman osoite vaaditaan."),
    eventPlace: z.string().min(1, "Tapahtuman paikka vaaditaan."),
    eventName: z.string().min(1, "Tapahtuman nimi vaaditaan."),
    eventDate: z.date({ message: "Valitse tapahtuman päivämäärä." }),
    eventTimeHours: z.any().optional(),
    eventTimeMinutes: z.any().optional(),
    instructionsFile: z.any().optional(),
    additionalServices: z.any().optional(),
    eventImage: z.any().optional()
});

const CreateMeetingModal = () => {
    const router = useRouter();

    const { isOpen, onClose, type, data } = useModal();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            invited_user: null,
            meet_title: '',
            meet_description: '',
            meet_start_time: '',
            meet_end_time: '',
            meet_date: '',
            meet_location: ''
        }
    });

    const isModalOpen = isOpen && type === "create-meeting";
    const isLoading = form.formState.isSubmitting;
    const { reset, setValue } = form;

    const onSubmit = async (data) => {
       console.log(data)
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0'>
                <DialogHeader className='pt-3 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        {data.edit
                            ? "Muokkaa tapaaminen"
                            : "Luo uusi tapaaminen"
                        }
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 space-y-2 max-sm:mx-0">
                        <div className="flex max-sm:block max-sm:space-y-3">

                            {/* Client Name */}
                            <FormField
                                control={form.control}
                                name="clientName"
                                render={({ field }) => (
                                    <FormItem className="mr-1 max-sm:ml-0 w-full">
                                        <FormLabel className="block mb-1">Asiakkaan nimi</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Name */}
                            <FormField
                                control={form.control}
                                name="eventName"
                                render={({ field }) => (
                                    <FormItem className="ml-1 max-sm:mr-0 w-full">
                                        <FormLabel className="block mb-1">Tapahtuman nimi</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex max-sm:block max-sm:space-y-3">

                            {/* Event Address */}
                            <FormField
                                control={form.control}
                                name="eventAddress"
                                render={({ field }) => (
                                    <FormItem className="mr-1 max-sm:mr-0 w-full">
                                        <FormLabel className="block mb-1">Tapahtuman osoite</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Place */}
                            <FormField
                                control={form.control}
                                name="eventPlace"
                                render={({ field }) => (
                                    <FormItem className="ml-1 max-sm:ml-0 w-full">
                                        <FormLabel className="block mb-1">Tapahtuman paikkakunta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Helsinki" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className="flex max-sm:block max-sm:space-y-3">

                            {/* Event Date */}
                            <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem className="mr-1 max-sm:mr-0 w-full ">
                                        <FormLabel className="block mb-1">Tapahtuman päivämäärä</FormLabel>
                                        <FormControl>
                                            <DatePicker {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>

                            {/* Event Time */}
                            <div className='w-full'>
                                <FormLabel className="block mb-1">Tapahtuman kellonaika</FormLabel>
                                <div className='flex w-full items-center'>
                                    <FormField
                                        control={form.control}
                                        name="eventTimeHours"
                                        render={({ field }) => (
                                            <FormItem className="max-sm:ml-0 w-full">
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={data && data?.event?.event_time ? data.event.event_time.split(":")[0] : "00"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {hours.map(hour => (
                                                                    <SelectItem className="m-0 p-1" key={hour} value={hour}>
                                                                        {hour}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >
                                    </FormField>
                                    <span className='px-1'> : </span>
                                    <FormField
                                        control={form.control}
                                        name="eventTimeMinutes"
                                        render={({ field }) => (
                                            <FormItem className="max-sm:ml-0 w-full">
                                                {/* <FormLabel className="block mb-1">Tapahtuman kellonaika</FormLabel> */}
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full capitalize">
                                                            <SelectValue placeholder={data && data?.event?.event_time ? data.event.event_time.split(":")[1] : "00"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {minutes.map(minutes => (
                                                                    <SelectItem key={minutes} value={minutes}>
                                                                        {minutes}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >
                                    </FormField>
                                </div>

                            </div>
                        </div>

                        <div className="flex max-sm:block max-sm:space-y-3">
                            {/* Group size */}
                            <FormField
                                control={form.control}
                                name="groupSize"
                                render={({ field }) => (
                                    <FormItem className="mr-1 max-sm:mr-0 w-full">
                                        <FormLabel className="block mb-1">Ryhmän koko</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Type */}
                            <FormField
                                control={form.control}
                                name="eventType"
                                render={({ field }) => (
                                    <FormItem className="ml-1 max-sm:ml-0 w-full">
                                        <FormLabel className="block mb-1">Tapahtuman tyyppi</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder={data && data?.event?.event_type ? data.event.event_type : "Valitse tapahtuman tyyppi"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {eventTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Additional Services */}
                        <FormField
                            control={form.control}
                            name="additionalServices"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lisäpalvelut</FormLabel>
                                    <FormControl>
                                        <MultipleSelectWithCheckbox
                                            placeholder="Valitse lisäpalvelut"
                                            options={['Ruokailu', 'Kuljetus', 'Valokuvaus', 'Majoitus']}
                                            field={field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='w-full'>
                            <FormLabel>Ohjelma - FI / EN</FormLabel>
                            <div className='flex'>
                                <div className='max-w-[50%] w-full mr-1'>
                                    <CKeditor
                                        content={eventDescriptionText}
                                        handleChange={handleChangeFI} />
                                </div>
                                <div className='max-w-[50%] w-full ml-1'>
                                    <div className='w-[300px] relative'>
                                        <CKeditor
                                            content={enEventDescriptionText}
                                            handleChange={handleChangeEN} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex max-sm:block max-sm:space-y-3">
                            <FormField
                                control={form.control}
                                name="instructionsFile"
                                render={({ field }) => (
                                    <FormItem className="mr-1 max-sm:ml-0 w-full">
                                        <FormLabel className="block mb-1" >Tapahtumaohjeistus</FormLabel>
                                        <FormControl className="cursor-pointer">
                                            <label className='w-full flex items-center justify-center cursor-pointer bg-clientprimary text-white h-9 px-3 py-1 rounded-md font-semibold'>

                                                {form.getValues("instructionsFile")
                                                    ? <span className="text-sm italic">{form.getValues("instructionsFile")[0].name}</span>
                                                    : <span className="text-sm">{form.formState.defaultValues.instructionsFile ? "Vaihda ohjeistus" : "Lataa ohjeistus"}</span>
                                                }

                                                <Input type="file" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                                            </label>
                                        </FormControl>
                                        <FormMessage />

                                        {form.getValues("instructionsFile") && (
                                            <div className="w-full flex items-center justify-between">

                                                <Button variant="link" type="button" asChild>
                                                    <Link className='flex items-center !p-0 !h-7' target="_blank" rel="noopener noreferrer" href={URL.createObjectURL(form.getValues("instructionsFile")[0])}><Eye className="mr-1 w-5 h-5" /> Näytä uusi ohjeistus</Link>
                                                </Button>
                                                <span className="cursor-pointer" onClick={() => {
                                                    setValue("instructionsFile", null);
                                                }}>
                                                    <X className="w-4 h-4" />
                                                </span>
                                            </div>
                                        )}

                                        {data && data.event?.instructions_file && form.getValues("instructionsFile") === null && (
                                            <Button variant="link" type="button" asChild>
                                                <Link className='flex items-center !p-0 !h-7' target="_blank" rel="noopener noreferrer" href={"https://supa.crossmedia.fi/storage/v1/object/public/" + data.event.instructions_file}><Eye className="mr-1 w-5 h-5" /> Näytä ohjeistus</Link>
                                            </Button>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="eventImage"
                                render={({ field }) => (
                                    <FormItem className="ml-1 max-sm:ml-0 w-full">
                                        <FormLabel className="block mb-1">Tapahtuman kuva</FormLabel>
                                        <FormControl className="cursor-pointer">
                                            <label className={cn('w-full flex items-center justify-center cursor-pointer bg-clientprimary text-white h-9 px-3 py-1 rounded-md font-semibold', eventImage && 'italic')}>
                                                {eventImage
                                                    ? <span className="text-sm">{eventImage.name}</span>
                                                    : <span className="text-sm">{data && data.event?.event_image ? "Vaihda kuva" : "Lataa kuva"}</span>
                                                }
                                                <Input type="file" className="hidden" onChange={(e) => {
                                                    field.onChange(e.target.files)
                                                    setEventImage(e.target?.files[0] ? e.target.files[0] : null)
                                                }} />
                                            </label>
                                        </FormControl>
                                        <FormMessage />

                                        {data && data.event?.event_image && !eventImage && (
                                            <Button variant="link" type="button" asChild>
                                                <Link className='flex items-center !p-0 !h-7' target="_blank" rel="noopener noreferrer" href={"https://supa.crossmedia.fi/storage/v1/object/public/" + data.event.event_image}><Eye className="mr-1 w-5 h-5" /> Näytä kuva</Link>
                                            </Button>
                                        )}

                                        {eventImage && (
                                            <div className="w-full flex items-center justify-between">
                                                <Button variant="link" type="button" asChild>
                                                    <Link className='flex items-center !p-0 !h-7' target="_blank" rel="noopener noreferrer" href={URL.createObjectURL(eventImage)}><Eye className="mr-1 w-5 h-5" /> Näytä uusi kuva</Link>
                                                </Button>
                                                <span className="cursor-pointer" onClick={() => {
                                                    setEventImage(null);
                                                    setValue("eventImage", null);
                                                }}>
                                                    <X className="w-4 h-4" />
                                                </span>
                                            </div>
                                        )}
                                    </FormItem>

                                )}
                            />
                        </div>

                        <DialogFooter className="pb-3">
                            {data?.duplicate && <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Luo tapahtuma"}</Button>}
                            {!data?.duplicate && <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : data.edit ? "Muokkaa tapahtuma" : "Luo tapahtuma"}</Button>}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateMeetingModal;


// create-event-modal.jsx:307 Uncaught (in promise) ReferenceError: eventImageFileName is not defined
//     at onSubmit (create-event-modal.jsx:307:27)
