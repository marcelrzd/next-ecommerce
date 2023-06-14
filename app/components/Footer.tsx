import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-4 footer footer-center bg-base-200 text-base-content h-max">
      <div>
        <p>
          Copyright © 2023 - All right reserved by{" "}
          <Link
            href={"https://github.com/marcelrzd"}
            className="font-medium text-primary hover:underline"
          >
            Marcel
          </Link>
        </p>
      </div>
    </footer>
  );
}
