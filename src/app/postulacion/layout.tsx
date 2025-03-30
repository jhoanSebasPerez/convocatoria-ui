import RoleGuard from "@/modules/auth/role-guard";

interface LayoutProps {
    readonly children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <RoleGuard allowedRoles={["ESTUDIANTE"]}>
            {children}
        </RoleGuard>
    );
}