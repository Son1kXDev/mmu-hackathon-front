import {auth} from "@/lib/auth";
import qs from "qs"
import {DatePickerWithRange} from "@/app/(with-layout)/application/new/DateRangePicker";
import {Button} from "@/components/ui/button";
import ChangePracticeDatesAction from "@/app/(with-layout)/dates/ChangePracticeDates.action";

export default async function Home() {
    const session = await auth()

    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rops?${qs.stringify({
        populate: "*",
        filters: {
            users_permissions_user: {
                id: {"$eq": session?.user.id}
            }
        }
    })}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.user.token}`
        }
    })
        .then(res => res.json())
        .catch(err => {
            console.error(err)
        })

    return <form className={'flex flex-col gap-y-4'} action={ChangePracticeDatesAction}>
        <p className="text-muted-foreground text-md">
            {`Даты стажировки для направления "${data?.data[0].direction.direction_name}"`}
        </p>
        <div>
            <DatePickerWithRange defaultDates={{
                from: new Date(data?.data[0].direction.practice_start ?? undefined),
                to: new Date(data?.data[0].direction.practice_end ?? undefined)
            }}/>
        </div>
        <div>
            <Button type={'submit'}>Сохранить</Button>
        </div>
    </form>
}