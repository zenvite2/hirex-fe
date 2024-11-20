export interface Project {
    id?: number;
    name: string;
    startDate: string;
    endDate: string;
    teamSize: number;
    position: string;
    description: string;
    link?: string;
}

export interface Certificate {
    id?: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id?: number;
    name: string;
    major: string
    startDate: string;
    endDate: string;
    gpa: string;
}

export interface Experience {
    id?: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Resume {
    id?: number;
    career?: string;
    hobby?: string;
    certificates?: Certificate[];
    projects: Project[];
    educations: Education[];
    experiences: Experience[]
}