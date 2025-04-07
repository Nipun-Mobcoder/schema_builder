/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import styles from "./component.module.css";

const Sidebar = ({ modelData }: { modelData: any }) => {
  const pathName = usePathname();
  const isActive = pathName.length > 1;

  return (
    <section className={styles.sideBarSection}>
      <div>
        <Link
          href="/"
          key=""
          className={styles.sideBarLink}
          style={{
            backgroundColor: !isActive ? "#0E78F9" : "",
          }}
        >
          <p>HOME</p>
        </Link>
        {modelData.map((data: { collectionName: string }) => {
          const isActive = pathName.startsWith(`/${data.collectionName}`);
          return (
            <Link
              href={data.collectionName}
              key={data.collectionName}
              className={styles.sideBarLink}
              style={{
                backgroundColor: isActive ? "#0E78F9" : "",
              }}
            >
              <p>{data.collectionName.toUpperCase()}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
