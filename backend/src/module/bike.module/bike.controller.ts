import { Body, Controller, Get, Post, Param, Delete, Patch, UseGuards, Headers, Query } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { BikeService } from './bike.service';
@Controller('/bikes')
export class BikeController {
    constructor(private readonly bikeService: BikeService) { }

    @UseGuards(AuthGuard)
    @Get('')
    getBikes(@Query() query, @Headers() { authtoken }): any {
        return this.bikeService.getAllBikes({ query, authtoken });
    }

    @UseGuards(AuthGuard)
    @Get('/filtered')
    getFilteredBikes(@Query() query, @Headers() { authtoken }): any {
        return this.bikeService.getAllFilteredBikes({ query, authtoken });
    }



    @UseGuards(AdminGuard)
    @Post('')
    createBike(@Body() { name, color, location, isAvailable }): any {
        return this.bikeService.createBike({ name, color, location, isAvailable });
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    updateBike(@Body() { name, color, location, isAvailable }, @Param('id') id: string): any {
        return this.bikeService.updateBike({ id, name, color, location, isAvailable });
    }

    @UseGuards(AdminGuard)
    @Delete('/:id')
    deleteUser(@Param('id') id: string): any {
        return this.bikeService.deleteBike(id);
    }

}
