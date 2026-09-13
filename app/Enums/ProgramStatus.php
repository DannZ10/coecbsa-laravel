<?php

namespace App\Enums;

enum ProgramStatus: string
{
    case Ongoing = 'ongoing';
    case Planned = 'planned';
    case Completed = 'completed';
}
