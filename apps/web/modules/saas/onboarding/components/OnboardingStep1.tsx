"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@saas/auth/hooks/use-user";
import { UserAvatarUpload } from "@saas/settings/components/UserAvatarUpload";
import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingStep1({ onCompleted }: { onCompleted: () => void }) {
	const { user } = useUser();
	const t = useTranslations();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? "",
		},
	});

	const updateUserMutation = apiClient.auth.update.useMutation();

	const onSubmit: SubmitHandler<FormValues> = async ({ name }) => {
		form.clearErrors("root");

		try {
			await updateUserMutation.mutateAsync({
				name,
			});

			onCompleted();
		} catch (e) {
			form.setError("root", {
				type: "server",
				message: t("onboarding.notifications.accountSetupFailed"),
			});
		}
	};

	return (
		<div>
			<Form {...form}>
				<form
					className="flex flex-col items-stretch gap-8"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("onboarding.account.name")}</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormItem className="flex items-center justify-between gap-4">
						<div>
							<FormLabel>{t("onboarding.account.avatar")}</FormLabel>

							<FormDescription>
								{t("onboarding.account.avatarDescription")}
							</FormDescription>
						</div>
						<FormControl>
							<UserAvatarUpload
								onSuccess={() => {
									return;
								}}
								onError={() => {
									return;
								}}
							/>
						</FormControl>
					</FormItem>

					<Button type="submit" loading={form.formState.isSubmitting}>
						{t("onboarding.continue")}
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
}
